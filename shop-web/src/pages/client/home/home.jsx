import React from "react";
import Banner from "../../../components/client/home/Banner";
import Category from "../../../components/client/home/Category";
import NewProduct from "../../../components/client/home/NewProduct";
import SaleProduct from "../../../components/client/home/SaleProduct";
import Post from "../../../components/client/home/Post";

function Home() {
  return (
    <div className="bg-gray-100 min-h-screen overflow-x-hidden">
      
      {/* ================= BANNER FULL WIDTH ================= */}
      <section
        className="
          relative w-screen 
          left-1/2 right-1/2 
          -ml-[50vw] -mr-[50vw]
          bg-black
        "
      >
        <Banner />
      </section>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4">
        
        {/* CATEGORY */}
        <section className="mt-8">
          <Category />
        </section>

        {/* NEW PRODUCT */}
        <section className="mt-10">
          <NewProduct />
        </section>

        {/* SALE PRODUCT */}
        <section className="mt-10 p-6 bg-red-50 rounded-2xl border border-red-100">
          <SaleProduct />
        </section>

        {/* POST */}
        <section className="mt-12 pb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Tin tức mới nhất
          </h2>
          <Post />
        </section>

      </div>
    </div>
  );
}

export default Home;
