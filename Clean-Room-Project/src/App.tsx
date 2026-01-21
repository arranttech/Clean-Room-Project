
import Navbar from "./components/navbar"
import HeroPage from "./components/heroSection/heropage"


export default function App() {
  return (
    <>
      <Navbar />
      <main className="pt-[180px]">
        <HeroPage />
      </main>
    </>
  )
}
