export default function Spinner(props: SpinnerProps) {
  const { white = false } = props;
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className={`w-full h-full min-w-[20px] min-h-[20px] border-4 ${
          white ? 'border-white' : 'border-zinc-500'
        } border-t-transparent rounded-full animate-spin aspect-square`}
      ></div>
    </div>
  );
}

type SpinnerProps = {
  white?: boolean;
};
