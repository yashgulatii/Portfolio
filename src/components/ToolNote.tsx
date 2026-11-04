type ToolNoteProps = {
  note: string;
};

export default function ToolNote({ note }: ToolNoteProps) {
  return (
    <p className="tool-note">
      {note}
    </p>
  );
}
