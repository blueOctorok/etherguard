export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto py-6 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-blue-600 font-bold text-sm">JB</span>
              </div>
              <span className="font-medium text-gray-700">
                JavaBean Analytics
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              A Blockchain Portfolio Project
            </p>
          </div>

          <div className="text-center md:text-right text-sm text-gray-500">
            <p>Gas tracking and analytics for ERC20 operations</p>
            <p className="mt-1">
              © {new Date().getFullYear()} JavaBean Analytics
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
