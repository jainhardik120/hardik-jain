import { useLayout } from '@/components/email-editor/ContextProvider';
import { Switch } from '@/components/ui/switch';

const PropertiesPanel = () => {
  const { selectedComponentId, selectedComponent, updateSelectedComponentProps } = useLayout();
  return (
    <div className="h-full p-4 bg-background border-l">
      <h4 className="mb-4 text-center">Properties</h4>
      <div className="space-y-4">
        <p>{selectedComponentId}</p>
        {selectedComponentId === 'root' ? (
          <div></div>
        ) : selectedComponent !== null ? (
          <div>
            <Switch
              onClick={() => {
                updateSelectedComponentProps({
                  ...selectedComponent,
                  editDisabled: !selectedComponent.editDisabled,
                });
              }}
              checked={selectedComponent.editDisabled}
            >
              Toggle Edit
            </Switch>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
