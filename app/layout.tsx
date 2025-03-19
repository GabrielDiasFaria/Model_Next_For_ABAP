"use client";
import { ShellBarMenuItemClickEventDetail } from "@ui5/webcomponents-fiori/dist/ShellBar";
import employeeIcon from "@ui5/webcomponents-icons/dist/employee.js";
import {
  Avatar,
  ShellBar,
  ListItemStandard,
  Ui5CustomEvent,
  ShellBarDomRef,
} from "@ui5/webcomponents-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface userSessionProps {
  name: string;
  id: string;
  email: string;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const route = useRouter();

  const getPath = (entity: string) => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      return `/${entity}`;
    }
    return `/sap/bc/ui5_ui5/sap/zz1next/server/app/${
      entity === "" ? "index" : entity
    }.html`;
  };

  const urls: Record<string, string> = {
    dashboard: getPath(""),
    artifacts: getPath("artifacts"),
  };

  const [user, setUser] = useState({} as userSessionProps);

  function menuClick(
    event: Ui5CustomEvent<ShellBarDomRef, ShellBarMenuItemClickEventDetail>
  ) {
    event.preventDefault();
    const key: string = event?.detail?.item?.dataset?.key ?? "dashboard";

    route.push(urls[key]);
  }

  async function getUser() {
    let userSession: any = localStorage.getItem("userSession");
    userSession = JSON.parse(userSession);

    if (userSession === null) {
      let response = await fetch(
        `${window.location.origin}/sap/bc/ui2/start_up`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      let result = await response.json();

      userSession = JSON.stringify(result);
      localStorage.setItem("userSession", userSession);

      userSession = localStorage.getItem("userSession");
      userSession = JSON.parse(userSession ?? { name: "", id: "", email: "" });
    }

    setUser(userSession);
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      </head>
      <body>
        <ShellBar
          logo={
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/1200px-SAP_2011_logo.svg.png"
              alt={"Fluxera"}
            />
          }
          onMenuItemClick={(event) => menuClick(event)}
          menuItems={
            <>
              <ListItemStandard data-key="dashboard">
                Dashboard
              </ListItemStandard>
              <ListItemStandard data-key="artifacts">
                Artefatos
              </ListItemStandard>
            </>
          }
          primaryTitle="Fluxera"
          profile={<Avatar icon={employeeIcon} />}
        />
        <div style={{ padding: "2rem" }}>{children}</div>
      </body>
    </html>
  );
}
