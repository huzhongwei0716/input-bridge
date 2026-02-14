import { useEffect } from 'react';
import { useStore } from './store';
import { domInteractive } from './DomInteractive';
import { InputBridgeSidebar } from '../components/input-bridge/input-bridge-sidebar';

const Sidebar = () => {
  const { 
    setMapping,
    activeKey, 
    isSelecting 
  } = useStore();

  useEffect(() => {
    if (isSelecting && activeKey) {
      domInteractive.activate((selector) => {
        setMapping(activeKey, selector);
      });
    } else {
      domInteractive.deactivate();
    }
    return () => domInteractive.deactivate();
  }, [isSelecting, activeKey, setMapping]);

  return <InputBridgeSidebar />;
};

export default Sidebar;
