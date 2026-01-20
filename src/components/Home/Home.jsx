import React from "react";
import { useParams } from "react-router-dom"; // Importamos useParams
import Header from "../Header/Header";
import Hero from "../Hero/Hero";
import GoogleReviews from "../GoogleReviews/GoogleReviews";
import PromoBanners from "../PromoBanners/PromoBanners";
import Catalog from "../Catalog/Catalog";
import Cotizar from "../Cotizar/Cotizar";
import Contact from "../Contact/Contact";
import Footer from "../Footer/Footer";

function Home() {
  const { slug } = useParams(); // Capturamos el slug de la URL (/auto/:slug)

  return (
    <main>
      <Header />
      <Hero />
      <GoogleReviews />
      <PromoBanners />
      <div id="catalogo">
        {/* Le pasamos el slug al catálogo */}
        <Catalog autoUrl={slug} />
      </div>
      <Cotizar />
      <Contact />
      <Footer />
    </main>
  );
}

export default Home;