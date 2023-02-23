import * as React from "react";
import createSanityClient from "@sanity/client";
import {PageComponent} from "../components/Page";

import type {
    GetServerDataProps,
    GetServerDataReturn,
    PageProps,
} from "gatsby";
import {
    CanvasClient,
    ComponentInstance,
    enhance,
    EnhancerBuilder,
} from "@uniformdev/canvas";
import {
    CANVAS_SANITY_PARAMETER_TYPES,
    createSanityEnhancer,
} from "@uniformdev/canvas-sanity";


// function to get composition
export const getComposition = async () => {
    const proId: string = "4d683e30-c332-4084-9024-fea2fd04c0d4";
    const apiK: string = "uf1j5j9wleq08ysfsdgz4h3z3u3ajykv7pf5n309jdr4z7qf9pfwytd3x839q8xytzu68g2p639ux8un7s2rzv3mapd6kcexq";

    const client = new CanvasClient({
        apiKey: apiK,
        projectId: proId,
    });
    const {composition} = await client.getCompositionBySlug({slug: "home"});
    return composition;
};

// Function to fetch Composition server-side
export async function getServerData({
                                        headers,
                                        method,
                                        url,
                                        query,
                                        params,
                                    }: GetServerDataProps): GetServerDataReturn {
    const composition = await getComposition();
    // Enhance composition
    await enhanceComposition(composition);
    // Return enhanced composition
    return {
        status: 200,
        props: {composition},
    };
}

// Sanity enhancer function
export async function enhanceComposition(composition: ComponentInstance) {
    const sanity_pro_id: string = "of2hm1rq"
    const sanity_data_Set: string = "production"

    const sanityClient = createSanityClient({
        projectId: sanity_pro_id,
        dataset: sanity_data_Set,
        useCdn: false,
    });
    // Create a modified enhancer to enhance the images and return offeringImage
    const sanityEnhancer = createSanityEnhancer({
        client: sanityClient,
        modifyQuery: (options) => {
            options.query = `*[_id == $id][0] { 
        "offeringImage": offeringImage.asset->url,
        ...
      }`;
            return options;
        },
    });
    await enhance({
        composition,
        enhancers: new EnhancerBuilder().parameterType(
            CANVAS_SANITY_PARAMETER_TYPES,
            sanityEnhancer
        ),
        context: {},
    });
}

const Homepage = (props: PageProps) => {
    const {serverData} = props;
    console.log('I am in homepage compo');

    return (
        <PageComponent>

        </PageComponent>
    );
};

export default Homepage;

