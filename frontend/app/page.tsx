import NavBar from "./ui/NavBar";


const HomePage = () => {
  return (
    <>
      <NavBar
        links={[
          { label: "About us", href: "/about" },
          { label: "Features", href: "/features" },
          {label: "Log in", href: "/"}
        ]}
        showButton={true}
        buttonHref="/auth"
        orientation="horizontal"
      />

      <section id="hero">
        {/* hero section... */}
      </section>
    </>
  );
};

export default HomePage;
