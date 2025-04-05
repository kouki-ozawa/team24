import Header from "./header/Header";
import Footer from "./footer/Footer";
import Sidebar from "./sidebar/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex flex-col flex-grow md:ml-0 w-full">
        <Header />
        <main className="flex-grow p-4 md:p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
} 