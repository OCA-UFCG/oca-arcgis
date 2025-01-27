export default function Home() {
  return (
    <main className="container mx-auto">
      <ul className="flex justify-center flex-col items-center">
        <li className="m-4">
          <a href="/layer" className="p-4 bg-blue-500 text-white rounded">Mapa</a>
        </li>
        <li className="m-4">
          <a href="/table" className="p-4 bg-blue-500 text-white rounded">Tabela</a>
        </li>
      </ul>
    </main>
  );
}