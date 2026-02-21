export default function PageLoader({ height = "h-60vh" }) {
  return (
    <div className={`flex justify-center items-center ${height}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
}
