export class DomInteractive {
    private isActive: boolean = false;
    private overlay: HTMLDivElement | null = null;
    private currentTarget: HTMLElement | null = null;
    private onSelectCallback: ((selector: string) => void) | null = null;

    constructor() {
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    public activate(onSelect: (selector: string) => void) {
        if (this.isActive) return;
        this.isActive = true;
        this.onSelectCallback = onSelect;
        this.createOverlay();

        document.addEventListener('mousemove', this.handleMouseMove, true);
        document.addEventListener('click', this.handleClick, true);
        document.body.style.cursor = 'crosshair';
    }

    public deactivate() {
        if (!this.isActive) return;
        this.isActive = false;
        this.onSelectCallback = null;
        this.removeOverlay();

        document.removeEventListener('mousemove', this.handleMouseMove, true);
        document.removeEventListener('click', this.handleClick, true);
        document.body.style.cursor = 'default';
        this.currentTarget = null;
    }

    private createOverlay() {
        if (this.overlay) return;
        this.overlay = document.createElement('div');
        this.overlay.style.position = 'absolute';
        this.overlay.style.pointerEvents = 'none';
        this.overlay.style.background = 'rgba(59, 130, 246, 0.2)'; // Blue transparent
        this.overlay.style.border = '2px solid #3b82f6';
        this.overlay.style.zIndex = '999999';
        this.overlay.style.transition = 'all 0.1s ease';
        this.overlay.style.borderRadius = '4px';
        // Append to body to ensure it's on top (z-index handles stacking)
        document.body.appendChild(this.overlay);
    }

    private removeOverlay() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }

    private handleMouseMove(e: MouseEvent) {
        if (!this.isActive || !this.overlay) return;

        // Use elementFromPoint to get the element under the cursor
        // We might need to temporarily hide the overlay or handle pointer-events: none
        const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;

        if (!target || target === document.body || target === document.documentElement) return;
        if (target.id === 'input-bridge-root' || target.closest('#input-bridge-root')) return; // Ignore our sidebar

        this.currentTarget = target;
        this.updateOverlay(target);
    }

    private updateOverlay(target: HTMLElement) {
        if (!this.overlay) return;

        const rect = target.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

        this.overlay.style.width = `${rect.width}px`;
        this.overlay.style.height = `${rect.height}px`;
        this.overlay.style.top = `${rect.top + scrollTop}px`;
        this.overlay.style.left = `${rect.left + scrollLeft}px`;
    }

    private handleClick(e: MouseEvent) {
        if (!this.isActive) return;

        e.preventDefault();
        e.stopPropagation();

        if (this.currentTarget) {
            const selector = this.generateSelector(this.currentTarget);
            if (this.onSelectCallback) {
                this.onSelectCallback(selector);
            }
            this.deactivate(); // Auto deactivate after selection? Maybe make configurable.
        }
    }

    // Strategy: ID -> Name -> Class -> Tag
    private generateSelector(el: HTMLElement): string {
        if (el.id) return `#${el.id}`;

        if (el.getAttribute('name')) {
            return `${el.tagName.toLowerCase()}[name="${el.getAttribute('name')}"]`;
        }

        // Heuristic: specific classes might be good, but Tailwind classes are bad selectors.
        // Ideally we want a unique path.
        // Simple fallback to a unique CSS path
        return this.getCssPath(el);
    }

    private getCssPath(el: HTMLElement): string {
        if (!(el instanceof Element)) return '';

        const path: string[] = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += `#${el.id}`;
                path.unshift(selector);
                break;
            } else {
                let sib: Element | null = el;
                let nth = 1;
                while (sib = sib.previousElementSibling) {
                    if (sib.nodeName.toLowerCase() === selector) nth++;
                }
                if (nth != 1) selector += `:nth-of-type(${nth})`;
            }
            path.unshift(selector);
            el = el.parentNode as HTMLElement;
        }
        return path.join(" > ");
    }

    public async fillForm(mappings: Record<string, any>) {
        for (const [selector, value] of Object.entries(mappings)) {
            try {
                if (typeof value === 'object' && value !== null && value.inputMethod === 'multi_select_batch') {
                    await this.fillMultiSelectBatch(selector, value.items);
                    continue;
                }

                const element = document.querySelector(selector) as HTMLElement;
                if (!element) continue;

                if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                    element.value = String(value);
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                } else if (element instanceof HTMLSelectElement) {
                    element.value = String(value);
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } catch (err) {
                console.error(`Failed to fill ${selector}`, err);
            }
        }
    }

    private async fillMultiSelectBatch(selector: string, items: any[]) {
        const triggerBtn = document.querySelector(selector) as HTMLElement;
        if (!triggerBtn) {
            console.error(`Trigger button not found for ${selector}`);
            return;
        }

        // 1. Click the dropdown trigger
        triggerBtn.click();
        await this.wait(500); // Wait for animation

        // 2. Identify the search box
        // naming convention: if trigger name="foo", search input name="search-box-foo"
        const triggerName = triggerBtn.getAttribute('name');
        let searchInput: HTMLInputElement | null = null;

        if (triggerName) {
            searchInput = document.querySelector(`input[name="search-box-${triggerName}"]`);
        }

        // Fallback: look for an input inside the same container or nearby
        if (!searchInput) {
            // Traverse up to find the menu container
            const menuContainer = triggerBtn.closest('.fake-menu-button');
            if (menuContainer) {
                searchInput = menuContainer.querySelector('input[type="text"]');
            }
        }

        if (!searchInput) {
            console.error('Search input not found, attempting to just click visible options if possible');
        }

        // 3. Loop through items
        for (const item of items) {
            const label = typeof item === 'object' ? item.label : item;

            if (searchInput) {
                // Type into search box
                searchInput.value = label;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                await this.wait(300); // 3.a Wait for filter
            }

            // 3.b Find the option
            // Look for menu items that are visible
            // The structure is typically div[role='menuitem'] or div[role='menuitemcheckbox']
            const menuItems = Array.from(document.querySelectorAll('[role^="menuitem"]'));
            const targetOption = menuItems.find(el => {
                // Check visibility
                if ((el as HTMLElement).offsetParent === null) return false;
                return el.textContent?.trim().toLowerCase() === label.toLowerCase();
            }) as HTMLElement;

            if (targetOption) {
                targetOption.click();
                console.log(`Selected: ${label}`);
            } else {
                console.warn(`Option not found: ${label}`);
                // Attempt to add valid custom value if supported (e.g. hitting Enter or clicking "Add")
                if (searchInput) {
                    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                }
            }

            await this.wait(100);
        }

        // 4. Close the menu
        // Clicking the trigger again usually closes it, or clicking document body
        triggerBtn.click();
    }

    private wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const domInteractive = new DomInteractive();
