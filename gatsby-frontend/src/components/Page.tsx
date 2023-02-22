// src/components/Page.tsx

import * as React from "react";
import {Layout} from "./Layout";

export const PageComponent = (props: any) => {
    return (
        <Layout>
            <div className="container mx-auto">{props.children}</div>
        </Layout>
    );
};

