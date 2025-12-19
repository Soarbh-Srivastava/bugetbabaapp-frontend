import { Link } from "react-router-dom";
import { Wallet, BarChart3, Shield, ArrowRightCircle } from "lucide-react";
import hero from "../assets/hero.png";

export default function Landing() {
  return (
    <div className="bg-[#F5F5F5] text-gray-800">
      {/* ======= Navbar ======= */}
      <nav className="flex items-center justify-between px-8 py-5 bg-[#E0E0E0] shadow-md">
        <h1 className="flex items-center text-2xl font-extrabold text-[#424242]">
          <Wallet className="w-7 h-7 mr-2 text-[#424242]" /> Budget Baba
        </h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="text-[#424242] hover:text-[#757575] font-semibold"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-[#424242] text-white rounded-xl hover:bg-[#757575] transition"
          >
            signup
          </Link>
        </div>
      </nav>

      {/* ======= Hero Section ======= */}
      <header className="flex flex-col lg:flex-row items-center justify-between px-10 lg:px-20 py-20 bg-gradient-to-r from-[#9E9E9E] to-[#424242] text-white">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h2 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            Take control of your{" "}
            <span className="text-[#F5F5F5]">finances</span>
          </h2>
          <p className="text-xl mb-8 max-w-md">
            Budget Baba helps you track expenses, plan savings, and reach your
            financial goals—stress-free.
          </p>
          <div className="space-x-4">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-[#F5F5F5] text-[#424242] font-bold rounded-xl shadow hover:bg-[#E0E0E0] hover:text-[#212121] transition"
            >
              Get Started Free
              <ArrowRightCircle className="ml-2 w-6 h-6" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-white text-[#424242] font-bold rounded-xl shadow hover:bg-[#E0E0E0] hover:text-[#212121] transition"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center"></div>
      </header>

      {/* ======= Features ======= */}
      <section className="px-10 lg:px-20 py-20 bg-[#F5F5F5] text-center">
        <h3 className="text-3xl font-bold mb-12 text-[#424242]">
          Why Choose Budget Baba?
        </h3>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="p-8 border border-[#BDBDBD] rounded-xl shadow-md hover:shadow-xl transition bg-white">
            <BarChart3 className="w-12 h-12 text-[#424242] mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-4">Smart Budgeting</h4>
            <p>Create custom budgets and track expenses effortlessly.</p>
          </div>
          <div className="p-8 border border-[#BDBDBD] rounded-xl shadow-md hover:shadow-xl transition bg-white">
            <Wallet className="w-12 h-12 text-[#424242] mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-4">Insights & Reports</h4>
            <p>
              Get detailed spending analytics to make better financial
              decisions.
            </p>
          </div>
          <div className="p-8 border border-[#BDBDBD] rounded-xl shadow-md hover:shadow-xl transition bg-white">
            <Shield className="w-12 h-12 text-[#424242] mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-4">Secure & Private</h4>
            <p>
              Your data is encrypted and stays safe with top-level security.
            </p>
          </div>
        </div>
      </section>

      {/* ======= Call to Action ======= */}
      <section className="bg-[#424242] text-white text-center py-20">
        <h3 className="text-4xl font-bold mb-6">Ready to master your money?</h3>
        <p className="text-lg mb-8">
          Join thousands of smart savers using Budget Baba today.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center px-10 py-4 bg-[#F5F5F5] text-[#424242] font-bold rounded-xl shadow hover:bg-[#E0E0E0] hover:text-[#212121] transition"
        >
          Create Free Account
          <ArrowRightCircle className="ml-2 w-6 h-6" />
        </Link>
      </section>

      {/* ======= Footer ======= */}
      <footer className="bg-[#9E9E9E] text-[#212121] text-center py-6">
        © {new Date().getFullYear()} Budget Baba. All rights reserved.
      </footer>
    </div>
  );
}
