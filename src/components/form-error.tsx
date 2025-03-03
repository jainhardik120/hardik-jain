export default function FormError({ message }: { message: string | undefined }) {
  if (message === undefined) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-2 text-sm ">
      <p>{message}</p>
    </div>
  );
}
