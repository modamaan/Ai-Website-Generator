// Selection script to be injected into the iframe
export const getSelectionScript = () => `
  (function() {
    console.log('🚀 Selection script starting...');
    let hoveredElement = null;
    let selectedElement = null;

    // Add styles for hover and selection
    const style = document.createElement('style');
    style.textContent = \`
      .editor-hover {
        outline: 2px dashed #3b82f6 !important;
        outline-offset: 2px !important;
        cursor: pointer !important;
      }
      .editor-selected {
        outline: 3px solid #8b5cf6 !important;
        outline-offset: 2px !important;
        position: relative !important;
      }
      .editor-selected::after {
        content: attr(data-element-tag);
        position: absolute;
        top: -24px;
        left: -3px;
        background: #8b5cf6;
        color: white;
        padding: 2px 8px;
        font-size: 10px;
        font-weight: 600;
        border-radius: 4px 4px 0 0;
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
      }
    \`;
    document.head.appendChild(style);
    console.log('✅ Styles injected');

    // Helper to get XPath
    function getXPath(element) {
      if (element.id) {
        return \`id("\${element.id}")\`;
      }
      if (element === document.body) {
        return '/html/body';
      }
      let ix = 0;
      const siblings = element.parentNode?.childNodes || [];
      for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling === element) {
          const parentPath = element.parentNode ? getXPath(element.parentNode) : '';
          return \`\${parentPath}/\${element.tagName.toLowerCase()}[\${ix + 1}]\`;
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
          ix++;
        }
      }
      return '';
    }

    // Helper to convert RGB to Hex
    function rgbToHex(rgb) {
      if (!rgb || rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') return '#ffffff';
      const match = rgb.match(/^rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
      if (!match) return rgb;
      const hex = (x) => ("0" + parseInt(x).toString(16)).slice(-2);
      return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
    }

    // Hover handler
    document.addEventListener('mouseover', (e) => {
      e.stopPropagation();
      const target = e.target;
      
      // Skip if it's the selected element
      if (target === selectedElement) return;
      
      // Remove previous hover
      if (hoveredElement && hoveredElement !== selectedElement) {
        hoveredElement.classList.remove('editor-hover');
      }
      
      hoveredElement = target;
      hoveredElement.classList.add('editor-hover');
    }, true);

    document.addEventListener('mouseout', (e) => {
      const target = e.target;
      if (target && target !== selectedElement) {
        target.classList.remove('editor-hover');
      }
    }, true);

    // Click handler
    document.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target;
      console.log('👆 Element clicked:', target.tagName);
      
      // Remove previous selection
      if (selectedElement) {
        selectedElement.classList.remove('editor-selected');
        selectedElement.removeAttribute('data-element-tag');
      }
      
      // Set new selection
      selectedElement = target;
      selectedElement.classList.add('editor-selected');
      selectedElement.classList.remove('editor-hover');
      selectedElement.setAttribute('data-element-tag', selectedElement.tagName.toLowerCase());

      // Get computed styles
      const styles = window.getComputedStyle(selectedElement);
      
      // Get text content (only direct text, not nested)
      let textContent = '';
      for (let node of selectedElement.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          textContent += node.textContent;
        }
      }
      
      const elementData = {
        tagName: selectedElement.tagName,
        textContent: textContent.trim(),
        innerHTML: selectedElement.innerHTML,
        styles: {
          color: rgbToHex(styles.color),
          backgroundColor: rgbToHex(styles.backgroundColor),
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          fontFamily: styles.fontFamily,
          padding: styles.padding,
          margin: styles.margin,
          textAlign: styles.textAlign,
        },
        classList: Array.from(selectedElement.classList).filter(c => !c.startsWith('editor-')),
        xpath: getXPath(selectedElement)
      };
      
      console.log('📤 Sending element data to parent:', elementData);
      
      // Send to parent
      window.parent.postMessage({
        type: 'ELEMENT_SELECTED',
        data: elementData
      }, '*');
    }, true);

    // Listen for deselect command
    window.addEventListener('message', (event) => {
      console.log('📨 Message received in iframe:', event.data);
      
      if (event.data.type === 'DESELECT_ELEMENT' && selectedElement) {
        selectedElement.classList.remove('editor-selected');
        selectedElement.removeAttribute('data-element-tag');
        selectedElement = null;
      }
      
      // Listen for style updates from parent
      if (event.data.type === 'UPDATE_STYLE' && selectedElement) {
        console.log('🎨 Updating style:', event.data.property, '=', event.data.value);
        selectedElement.style[event.data.property] = event.data.value;
      }
      
      // Listen for text updates from parent
      if (event.data.type === 'UPDATE_TEXT' && selectedElement) {
        console.log('📝 Updating text:', event.data.text);
        // Update only direct text nodes
        for (let node of selectedElement.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = event.data.text;
            break;
          }
        }
        // If no text node exists, create one
        if (!selectedElement.childNodes.length || selectedElement.childNodes[0].nodeType !== Node.TEXT_NODE) {
          selectedElement.textContent = event.data.text;
        }
      }
    });

    console.log('✅ Selection script loaded and ready!');
  })();
`;
