import { FC } from "react";
import image from "./images/section-img.jpeg";
import { useNavigate } from "react-router-dom";

interface AppProps {
  title?: string;
}

const App: FC<AppProps> = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <section className="flex flex-col items-center text-center py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-yellow-500 dark:text-primary">
          The future of work is
          <br /> flexible
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl">
          Connect teams in-person and across the world, eliminate empty offices, and design smart
          spaces in one intuitive platform for hybrid workplace management.
        </p>

        <div className="mt-8 flex space-x-4">
          <button
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 focus:outline-none"
            onClick={() => navigate(`/rooms`)}
          >
            Make Reservation
          </button>
        </div>

        <div className="mt-8 flex items-center space-x-10 text-gray-700">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1">
              <span className="text-lg font-semibold">4.9</span>
              <span className="text-yellow-500">
                <i className="fas fa-star"></i>
              </span>
              <span className="text-yellow-500">
                <i className="fas fa-star"></i>
              </span>
              <span className="text-yellow-500">
                <i className="fas fa-star"></i>
              </span>
              <span className="text-yellow-500">
                <i className="fas fa-star"></i>
              </span>
              <span className="text-yellow-500">
                <i className="fas fa-star"></i>
              </span>
            </div>
            <p className="text-sm">
              Reviews on <span className="font-bold text-blue-600">Capterra</span>
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1">
              <span className="text-lg font-semibold">4.8</span>
              <span className="text-yellow-500">
                <i className="fas fa-star"></i>
              </span>
              <span className="text-yellow-500">
                <i className="fas fa-star"></i>
              </span>
              <span className="text-yellow-500">
                <i className="fas fa-star"></i>
              </span>
              <span className="text-yellow-500">
                <i className="fas fa-star"></i>
              </span>
              <span className="text-yellow-500">
                <i className="fas fa-star"></i>
              </span>
            </div>
            <p className="text-sm">
              Reviews on <span className="font-bold text-red-500">G2</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
