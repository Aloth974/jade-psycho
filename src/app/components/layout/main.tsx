import './main.scss';

export default function Main({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="page">
        {children}
      </div>
    </main>
  );
}
