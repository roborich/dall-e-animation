declare module "bezier-easing-editor" {
  export type Bezier = [number, number, number, number];
  interface BezierEditorProps {
    defaultValue: Bezier;
    onChange: (update: Bezier) => void;
  }
  function BezierEditor(props: BezierEditorProps): React.ReactElement;
  export default BezierEditor;
}
