import clsx from "clsx";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({ 
  children, 
  className,
  as: Component = "div" 
}: ContainerProps) {
  return (
    <Component 
      className={clsx(
        "mx-auto w-full max-w-[1440px]",
        "px-4 md:px-6 lg:px-8", // Responsive horizontal padding
        className
      )}
    >
      {children}
    </Component>
  );
}

export function Section({
  children,
  className,
  id
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section 
      id={id}
      className={clsx(
        "w-full",
        "py-16 md:py-32", // Mobile: 64px (16*4), Desktop: 128px (32*4) ~= 120px
        className
      )}
    >
      {children}
    </section>
  );
}
