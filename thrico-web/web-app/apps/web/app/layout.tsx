import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import { Button, ConfigProvider, Result } from "antd";
import "antd/dist/reset.css";
import { workSans } from "./font";
import getData from "./server/get-details";

import { ApolloWrapper } from "@/utils/apollo-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    // Fetch data and handle potential errors within RootLayout
    const data = await getData();
    console.log(data.theme);
    return (
      <html lang="en">
        <ApolloWrapper>
          {process.env.NEXT_PUBLIC_API_URL}
          <body className={workSans.className}>
            <AntdRegistry>
              <ConfigProvider
                theme={{
                  components: {
                    Collapse: {
                      headerPadding: "24px",
                      contentPadding: "24px",
                      borderRadiusLG: 8,
                    },
                    Segmented: {},
                    Modal: {
                      wireframe: true,
                    },
                  },
                  token: {
                    ...data?.theme,
                    fontFamily: "'Work Sans', sans-serif;", // Ensuring font className usage
                    itemSelectedBg: "red",
                    borderRadius: 20,
                  },
                }}
              >
                {children}
              </ConfigProvider>
            </AntdRegistry>
          </body>
        </ApolloWrapper>
      </html>
    );
  } catch (error) {
    console.error("Failed to load theme data:", error);
    // Optionally render fallback content or styling if `getData` fails
    return (
      <html lang="en">
        {process.env.NEXT_PUBLIC_API_URL}
        <body className={workSans.className}>
          <AntdRegistry>
            <ConfigProvider
              theme={{
                components: {
                  Segmented: {},
                  Modal: {
                    wireframe: true,
                  },
                },
                token: {
                  fontFamily: "'Work Sans', sans-serif;",

                  borderRadius: 20,
                },
              }}
            >
              <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Button type="primary">Back Home</Button>}
              />
            </ConfigProvider>
          </AntdRegistry>
        </body>
      </html>
    );
  }
}
