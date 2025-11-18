import ExploreDetails from "@/components/ExploreDetails";
import { Header } from "@/components/Header";
import { Headline } from "@/components/Headline";
import  Highlights  from "@/components/Highlights";
import { Roi } from "@/components/Roi";
import { Setors } from "@/components/Setors";

export default function Home() {
  return (
    <>
    <Header></Header>
    <Headline></Headline>
    <Highlights></Highlights>
    <ExploreDetails></ExploreDetails>
    <Roi></Roi>
    <Setors></Setors>
    </>
  );
}
