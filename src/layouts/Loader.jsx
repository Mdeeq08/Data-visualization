const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
};

export default Loader;
