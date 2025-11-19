import ExploreDetails from "@/components/ExploreDetails";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Headline } from "@/components/Headline";
import Highlights from "@/components/Highlights";
import { News } from "@/components/News";
import { Roi } from "@/components/Roi";
import { Setors } from "@/components/Setors";
import Showcase from "@/components/Showcase";

export default function Home() {
  return (
    <>
      <Header></Header>
      <main>
        <Headline></Headline>
        <Highlights></Highlights>
        <ExploreDetails></ExploreDetails>
        <Roi></Roi>
        <Setors></Setors>
        {/* <Showcase></Showcase> */}
        <News></News>
      </main>
      {/* <Footer></Footer> */}

    </>
  );
}
