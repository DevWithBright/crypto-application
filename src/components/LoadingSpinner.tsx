
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[40vh]">
      <div className="w-16 h-16 border-8 border-black border-t-brutalist-red animate-spin rounded-full"></div>
      <p className="mt-4 text-2xl font-bold uppercase tracking-wider">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
