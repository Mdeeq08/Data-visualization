import { ChartColumn, Home, NotepadText,  } from "lucide-react";
//Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users
//import ProfileImage from "@/assets/profile-image.jpg";
//import ProductImage from "@/assets/product-image.jpg";

export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/",
            },
            {
                label: "Analytics",
                icon: ChartColumn,
                path: "/analytics",
            },
            {
                label: "Reports",
                icon: NotepadText,
                path: "/reports",
            },
        ],
    },
];

