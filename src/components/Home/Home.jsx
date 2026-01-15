import React from "react";
import Header from "../Header/Header";
import Hero from "../Hero/Hero";
import Featuress from "../Featuress/Featuress";
import Catalog from "../Catalog/Catalog";
import Contact from "../Contact/Contact";
import Footer from "../Footer/Footer";

function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Featuress />
      <div id="catalogo">
        <Catalog />
      </div>
      <Contact />
      <Footer />
    </main>
  );
}

export default Home;
