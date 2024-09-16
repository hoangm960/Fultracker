import { useState, useEffect } from "react";
import dagre from "dagre";
import { useReactFlow, useStoreApi } from "@xyflow/react";

const DagreNodePositioning = () => {
    const store = useStoreApi();
    const { nodeLookup, edgeLookup } = store.getState();
    const nodes = Array.from(nodeLookup).map(([, node]) => node);
    const edges = Array.from(edgeLookup).map(([, edge]) => edge);
    const { setNodes, setEdges } = useReactFlow();


    useEffect(() => {
        // node dimensions are not immediately detected, so we want to wait until they are

    }, [nodes, edges]);

    return null;
};

export default DagreNodePositioning;