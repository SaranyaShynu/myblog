export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Spinner */}
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>

      {/* Text */}
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        {text}
      </p>
    </div>
  );
}
