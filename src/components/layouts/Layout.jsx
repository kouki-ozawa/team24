import Header from "./header/Header";
import Footer from "./footer/Footer";
import Sidebar from "./sidebar/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
} 