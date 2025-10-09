interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-neutral-900">
      {children}
    </div>
  );
}
