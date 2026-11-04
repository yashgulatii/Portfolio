import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page not found | Yash Gulati</title>
      </Helmet>
      <PageShell>
        <div className="notebook-section">
          <h1>Page not found</h1>
          <p>
            <Link to="/">Return to home</Link>
          </p>
        </div>
      </PageShell>
    </>
  );
}
