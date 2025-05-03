import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DocumentGrid from "@/components/dashboard/DocumentGrid";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background dark:bg-background">
            <DashboardNavbar />
            <main className="container mx-auto px-4 pt-12 pb-12">
                <DocumentGrid />
            </main>
        </div>
    );
}
