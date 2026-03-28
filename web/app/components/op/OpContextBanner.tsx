export default function OpContextBanner({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="opContextBanner">
      <div className="opContextBannerTitle">{title}</div>
      {children ? <div className="opContextBannerBody">{children}</div> : null}
    </div>
  );
}
