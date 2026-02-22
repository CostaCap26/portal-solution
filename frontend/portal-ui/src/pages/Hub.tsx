import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Portal {
    slug: string;
    role: string;
}

export default function Hub() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    if (!auth) {
        return <div className="p-8">Non autenticato</div>;
    }

    const portals: Portal[] =
        auth.portals?.map((p) => {
            const [slug, role] = p.split("|");
            return { slug, role };
        }) ?? [];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-2xl font-semibold mb-6">I tuoi Portali</h1>

            {portals.length === 0 && (
                <div>Nessun portale disponibile.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {portals.map((portal) => (
                    <div
                        key={portal.slug}
                        className="bg-white p-6 rounded-xl shadow border border-gray-100 hover:shadow-lg transition cursor-pointer"
                        onClick={() => navigate(`/portal/${portal.slug}`)}
                    >
                        <h2 className="text-lg font-semibold text-gray-900">
                            {portal.slug.toUpperCase()}
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                            Ruolo: {portal.role}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}