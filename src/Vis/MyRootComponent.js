import { SendClientRequestFrom } from "./SendClientRequestForm";
import { NodeVisualization } from "./NodeVisualization";
import { useState } from "react";
import * as d3 from 'd3'
import { useEffect, useRef } from 'react';
import msgSVG from './message.svg'

let xStart = 10;
let yStart = 8;
let vis_time = 1500;
export let MyRootComponent = () => {
    let prevConsensusData;
    let [startVisFlag, setStartVisFlag] = useState(false);
    let [consensusData, setConsensusData] = useState(null)
    let [visPhase, setVisPhase] = useState(null);
    let startVisualization = ( consensusDataFromServer ) => {
        setStartVisFlag(!startVisFlag);
        setConsensusData(consensusDataFromServer);
    }

    useEffect(() => {
        //if( prevConsensusData !== consensusData ) 
            consensusData && showCommunicationNew( consensusData,  setVisPhase )
      }, [consensusData]);
    return (
        <>
            <SendClientRequestFrom startVisualization={startVisualization}/>
            <div style={{display: 'flex'}}>
            <NodeVisualization view={visPhase} 
                numberOfReplicas={consensusData && consensusData.numberOfReplicas}
                primary={consensusData && consensusData.primary_id}/>
            </div>
        </>
    )
    
}
let showReplicaToReplicaCommunication = ( fromNodes, toNodes, phaseName, numberOfReplicas ) => {
    let radius = 21/(2*(numberOfReplicas-1));
    let nodeConnections =
        {
            x1: xStart+radius,
            y1: yStart,
            x2: 100-xStart-radius,
            y2: yStart
        };
    const svgSelector = d3.select( '#vis-svg' )

    //if (svgSelector.classed(`svg-phase-${phaseName}`))
    const phaseTextRect = svgSelector.append( 'g' )
                                    .attr( 'id', 'phase-text')

    phaseTextRect.append( 'ellipse' )
                .attr( 'cx', 50 )
                .attr( 'cy', 2.5)
                .attr( 'rx', 25)
                .attr( 'ry', 2)
    phaseTextRect.classed(`svg-phase-${phaseName}`, true);
        const phaseNameText = phaseTextRect.append('text')
            .attr( 'id', phaseName)
            .attr( 'dominant-baseline', 'middle' )
            .attr('text-anchor', 'middle')
            .attr( 'x', 50)
            .attr( 'y', 2.5)
            .attr("font-size", "2")
            .style( 'fill', 'white')
            .text( phaseName )

    // x co-ordinate is same for all nodes
    const toNodeStartCoord_Y = nodeConnections.y2;

    // render all communication lines and message icons
    showCommunicationLines(svgSelector, fromNodes, toNodes, nodeConnections.x1, nodeConnections.y1,
                            nodeConnections.x2, nodeConnections.y2, numberOfReplicas)

    // transition message icons along the communication lines
    for(let i=0; i < fromNodes.length; i++ ) {
        for( let j=0; j < toNodes.length; j++ ) {
            const smvImg = d3.select( `#line_${fromNodes[i]}${toNodes[j]}` )
                        .transition()
                        .duration(vis_time)
                        .ease(d3.easeLinear)
                        .attr('x', 100-xStart-radius - 3 )
                        .attr('y', toNodeStartCoord_Y + ((toNodes[j]-1)*(2*radius + (13/(numberOfReplicas-1)))) - 1.5)
                        .transition()
                        .duration(100)
                        .remove()
        }
    }

    // hide all communication lines 
    svgSelector.selectAll( 'line' )
                .transition()
                .duration(vis_time+100)
                .remove()
    svgSelector.select( `#${phaseName}` )
                .transition()
                .on('end', () => {
                    svgSelector.classed(`svg-phase-${phaseName}`, false);
                })
                .duration(vis_time+100)
                .remove()
    phaseTextRect.transition()
                .duration(vis_time+100)
                .remove()
}

let showClientToReplicasCommunication = ( fromNodes, toNodes, phaseName, numberOfReplicas ) => {
    let radius = 21/(2*(numberOfReplicas-1));
    let nodeConnections =
    {
        x1: xStart+radius,
        y1: yStart,
        x2: 100-xStart-radius,
        y2: yStart
    };

    const svgSelector = d3.select( '#vis-svg' )

    //if (svgSelector.classed(`svg-phase-${phaseName}`))
    const phaseTextRect = svgSelector.append( 'g' )
                                    .attr( 'id', 'phase-text')

    phaseTextRect.append( 'ellipse' )
            .attr( 'cx', 50 )
            .attr( 'cy', 2.5)
            .attr( 'rx', 25)
            .attr( 'ry', 2)
    phaseTextRect.classed(`svg-phase-${phaseName}`, true);
        const phaseNameText = phaseTextRect.append('text')
            .attr( 'id', phaseName)
            .attr( 'dominant-baseline', 'middle' )
            .attr('text-anchor', 'middle')
            .attr( 'x', 50)
            .attr( 'y', 2.5)
            .attr("font-size", "2")
            .style( 'fill', 'white')
            .text( phaseName )

    const toNodeStartCoord_Y = nodeConnections.y2;
    showCommunicationLines(svgSelector, fromNodes, toNodes, nodeConnections.x1, 25,
                nodeConnections.x2, nodeConnections.y2, numberOfReplicas)

    // transition message icons along the communication lines
    for(let i=0; i < fromNodes.length; i++ ) {
        for( let j=0; j < toNodes.length; j++ ) {
            const smvImg = d3.select( `#line_${fromNodes[i]}${toNodes[j]}` )
                        .transition()
                        .duration(vis_time)
                        .ease(d3.easeLinear)
                        .attr('x', 100-xStart-radius - 3 )
                        .attr('y', toNodeStartCoord_Y + ((toNodes[j]-1)*(2*radius + (13/(numberOfReplicas-1)))) - 1.5)
                        .transition()
                        .duration(100)
                        .remove()
        }
    }

    // hide all communication lines 
    svgSelector.selectAll( 'line' )
                .transition()
                .duration(vis_time+100)
                .remove()
    svgSelector.select( `#${phaseName}` )
                .transition()
                .on('end', () => {
                    svgSelector.classed(`svg-phase-${phaseName}`, false);
                })
                .duration(vis_time+100)
                .remove()
    phaseTextRect.transition()
                .duration(vis_time)
                .transition()
                .duration(100)
                .remove()
}

let showReplicasToClientCommunication = ( fromNodes, toNodes, phaseName, numberOfReplicas ) => {
    let radius = 21/(2*(numberOfReplicas-1));
    let nodeConnections =
        {
            x1: xStart+radius,
            y1: yStart,
            x2: 100-xStart-radius,
            y2: yStart
        };
    const svgSelector = d3.select( '#vis-svg' )

    //if (svgSelector.classed(`svg-phase-${phaseName}`))
    const phaseTextRect = svgSelector.append( 'g' )
                                    .attr( 'id', 'phase-text')

    phaseTextRect.append( 'ellipse' )
            .attr( 'cx', 50 )
            .attr( 'cy', 2.5)
            .attr( 'rx', 25)
            .attr( 'ry', 2)
    phaseTextRect.classed(`svg-phase-${phaseName}`, true);
        const phaseNameText = phaseTextRect.append('text')
            .attr( 'id', phaseName)
            .attr( 'dominant-baseline', 'middle' )
            .attr('text-anchor', 'middle')
            .attr( 'x', 50)
            .attr( 'y', 2.5)
            .attr("font-size", "2")
            .style( 'fill', 'white')
            .text( phaseName )

    const toNodeStartCoord_Y = nodeConnections.y2;
    showCommunicationLines(svgSelector, fromNodes, toNodes, nodeConnections.x1, nodeConnections.y1,
                nodeConnections.x2, 25, numberOfReplicas)

    // transition message icons along the communication lines
    for(let i=0; i < fromNodes.length; i++ ) {
        for( let j=0; j < toNodes.length; j++ ) {
            const smvImg = d3.select( `#line_${fromNodes[i]}${toNodes[j]}` )
                        .transition()
                        .duration(vis_time)
                        .ease(d3.easeLinear)
                        .attr('x', 100-xStart-radius - 3 )
                        .attr('y', 25 - 2.5)
                        .transition()
                        .duration(100)
                        .remove()
        }
    }

    // hide all communication lines 
    svgSelector.selectAll( 'line' )
                .transition()
                .duration(vis_time+100)
                .remove()
    svgSelector.select( `#${phaseName}` )
                .transition()
                .on('end', () => {
                    svgSelector.classed(`svg-phase-${phaseName}`, false);
                })
                .duration(vis_time+100)
                .remove()
    phaseTextRect.transition()
                .duration(vis_time)
                .transition()
                .duration(100)
                .remove()
}

let showCommunicationLines = ( svgSelector, fromNodes, toNodes, from_x, from_y, to_x, to_y, numberOfReplicas ) => {
    let from_y_start;
    let radius = 21/(2*(numberOfReplicas-1));

    for( let i=0; i < fromNodes.length; i++ ) {
        from_y_start = from_y + ((fromNodes[i]-1)%4)*(2*radius + (13/(numberOfReplicas-1)));
        for( let j=0; j < toNodes.length; j++ ) {
            svgSelector.append( 'line' )
                    .attr('x1', from_x+0.5)
                    .attr('y1', from_y_start)
                    .attr('x2', to_x-0.5)
                    .attr('y2', to_y + (((toNodes[j]-1)%4)*(2*radius + (13/(numberOfReplicas-1)))) )
            svgSelector.append( 'image' )
                    .attr( 'id', `line_${fromNodes[i]}${toNodes[j]}`)
                    .attr( 'href', msgSVG )
                    .attr( 'width', 3 )
                    .attr( 'height', 3 )
                    .attr('x', from_x)
                    .attr('y', from_y_start - 1.5);
        }
    }
}

let showCommunicationNew = ( data, setVisPhase ) => {
    d3.select( '#vis-svg' )
        .data(data.phases)
        .join()
        .transition()
        .on( 'start', function(d,i) {
            if( d.senders[0] === data.numberOfReplicas+1) {
                setVisPhase(0)
                showClientToReplicasCommunication( d.senders, d.receivers, d.phase, data.numberOfReplicas )
            }
            else if( d.receivers[0] === data.numberOfReplicas+1 ) {
                setVisPhase(2)
                showReplicasToClientCommunication( d.senders, d.receivers, d.phase, data.numberOfReplicas )                
            }
            else {
                setVisPhase(1)
                showReplicaToReplicaCommunication( d.senders, d.receivers, d.phase, data.numberOfReplicas )
                console.log(d)
            }
        })
        .delay( function(d,i) {
            return i*(vis_time+200)
        })
}  
 