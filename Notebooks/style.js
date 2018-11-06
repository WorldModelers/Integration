vizmap = [

   {selector: "node", css: {
      "shape": "ellipse",
      "text-valign":"bottom",
      "text-halign":"center",
      "content": "data(name)",
      "background-color": "#FFFFFF",
      "border-color":"black","border-width":"1px",
      "width": "mapData(degree, 0.0, 5.0, 20.0, 200.0)",
      "height":"mapData(degree, 0.0, 5.0, 20.0, 200.0)",
      "font-size":"8px"}},

   {selector:"node:selected", css: {
       "text-valign":"center",
       "text-halign":"center",
       "border-color": "black",
       "overlay-opacity": 0.2,
       "overlay-color": "blue"
       }},
       
   {selector:"edge:selected", css: {
       "overlay-opacity": 0.2,
       "overlay-color": "red"
       }},

   {selector: 'edge[interaction="increases"]', css: {
      "source-arrow-shape": "triangle",
      "source-arrow-color": "green", 
      "line-color": "mapData(flux, -14, 0, green, #EDEDED)",
      "width":      "mapData(flux, 0, 14, 1, 10)",
      "curve-style":"bezier"   // bezier, haystack
      }},

   {selector: 'edge[interaction="decreases"]', css: {
      "source-arrow-shape": "triangle",
      "source-arrow-color": "red", 
      "line-color": "mapData(flux, 0, 14, #EDEDED, red)",
      "width":      "mapData(flux, 0, 14, 1, 10)",
      "curve-style":"bezier"   // bezier, haystack
    }},    
    
 
];