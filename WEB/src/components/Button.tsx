export function Button(
  props: React.HTMLAttributes<HTMLButtonElement> & {
    stretchFull?: boolean;
    disabled?: boolean;
  },
) {
  return (
    <button
      {...props}
      className={`bg-black hover:opacity-75 h-12 text-white font-bold rounded-md hover:rounded-none transform transition-all duration-500  shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] ${
        props.stretchFull ? 'w-full' : ''
      }
        `}
    />
  );
}
