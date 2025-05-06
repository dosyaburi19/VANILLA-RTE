/**
 * split to child nodes in div
 *
 * @param {HTMLDivElement} div
 * @returns ChildNode[];
 */
function _splitNode(div) {
    const nodes = [];
    for (const item of Object.values(div.childNodes)) {
        nodes.push(item);
    }

    return nodes;
}

/**
 * put the cursor on last span element
 *
 * @param {Selection} selection
 * @param {Range} range
 * @param {HTMLSpanElement | null | undefined} last
 */
function _endToCursor(selection, range, last) {
    selection.removeAllRanges();
    range.selectNode(last);
    selection.addRange(range);
    selection.collapseToEnd();
}

/**
 * setting on style property of node
 *
 * @param {Node[]} inNodeArr
 * @param {string} styleName
 * @param {string} style
 */
function _setStyleProperty(inNodeArr, styleName, style) {
    let isApply = false;

    for (const node of inNodeArr) {
        if (node.style.getPropertyValue(styleName) !== style) {
            isApply = true;
        }
    }

    for (const node of inNodeArr) {
        if (isApply) {
            node.style.setProperty(styleName, style);
        } else {
            node.style.removeProperty(styleName);
        }
    }
}

/**
 * find the div element
 *
 * @param {Node} node
 * @returns HTMLDivElement
 */
function _getRootDIV(node) {
    let parent = node;

    while (parent.nodeName !== "DIV") {
        parent = parent.parentElement;
    }

    return parent;
}

/**
 * check the same node
 *
 * @param {Node} node
 * @param {Node} container
 * @returns Boolean
 */
function _isSameNode(node, container) {
    return node === container || node === container.parentElement;
}

/**
 * protected line on delete or backspace key up
 *
 * @param {KeyboardEvent} event
 */
export function onDeleteKeyUpProtectedLine(event) {
    if (
        event.key === "Backspace" ||
        event.keyCode === 8 ||
        event.key === "Delete" ||
        event.keyCode === 46
    ) {
        const target = event.target;
        const firstLine = target.firstChild;
        const endLine = target.lastChild;

        if (firstLine === endLine) {
            const node = document.createElement("div");
            const br = document.createElement("br");
            node.appendChild(br);

            if (firstLine?.nodeName === "BR") {
                target.replaceChild(node, firstLine);
            } else if (!firstLine) {
                target.appendChild(node);
            }
        }
    }
}

/**
 * enrich text
 *
 * @param {string} styleName
 * @param {string} style
 * @returns void
 */
export function enrichText(styleName, style) {
    const selection = window.getSelection() || new Selection();
    const range = selection.getRangeAt(0);

    // 줄 단위 div 태그 가져옴
    let RootDIV = _getRootDIV(range.startContainer);

    // contentEditable 이 true 가 아닌 것들은 변환시키지 않음
    if (RootDIV.parentElement.contentEditable !== "true") return;

    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    let nextDiv = RootDIV;
    let isStart = false,
        isIn = false,
        isEnd = false;

    let last;

    const inNodeArr = [];
    while (!isStart || !isEnd) {
        RootDIV = nextDiv;
        if (!RootDIV.nextSibling) break;
        nextDiv = RootDIV.nextSibling;

        // range.startContainer 에서 줄 단위 div 내부 노드를 배열로 반환
        const nodes = _splitNode(RootDIV);
        // 새로운 div 생성
        const newDiv = document.createElement("div");

        for (const item of nodes) {
            // 한 줄 처리 (해당 노드가 startContainer 이거나 startContainer.parentElement 이면서 endContainer 이거나 endContainer.parentElement 일 때)
            if (
                _isSameNode(item, range.startContainer) &&
                _isSameNode(item, range.endContainer)
            ) {
                console.log("startEnd");
                isStart = true;
                isEnd = true;

                let firstNode, innerNode, lastNode;
                firstNode =
                    startOffset === 0
                        ? null
                        : item.nodeType === Node.TEXT_NODE
                        ? document.createTextNode(
                              item.textContent.substring(0, startOffset)
                          )
                        : document.createElement("span");
                lastNode =
                    endOffset === item.textContent.length
                        ? null
                        : item.nodeType === Node.TEXT_NODE
                        ? document.createTextNode(
                              item.textContent.substring(endOffset)
                          )
                        : document.createElement("span");
                innerNode = document.createElement("span");

                if (item.nodeType !== Node.TEXT_NODE) {
                    innerNode.style.cssText = item.style.cssText;
                }
                inNodeArr.push(innerNode);
                innerNode.innerText = item.textContent.substring(
                    startOffset,
                    endOffset
                );

                if (firstNode !== null) {
                    if (item.nodeType !== Node.TEXT_NODE) {
                        firstNode.style.cssText = item.style.cssText;
                    }
                    firstNode.innerText = item.textContent.substring(
                        0,
                        startOffset
                    );
                }

                if (lastNode !== null) {
                    if (item.nodeType !== Node.TEXT_NODE) {
                        lastNode.style.cssText = item.style.cssText;
                    }
                    lastNode.innerText = item.textContent.substring(endOffset);
                }

                if (firstNode) newDiv.appendChild(firstNode);
                newDiv.appendChild(innerNode);
                if (lastNode) newDiv.appendChild(lastNode);

                last = innerNode;
            }
            // 여기서부터는 다중 줄 처리
            // 시작 줄 처리 (현재 노드가 range.startContainer 이거나 startContainer.parentElement 일 때)
            else if (_isSameNode(item, range.startContainer)) {
                console.log("start");
                isStart = true;
                isIn = true;

                let firstNode, lastNode;
                firstNode =
                    startOffset === 0
                        ? null
                        : item.nodeType === Node.TEXT_NODE
                        ? document.createTextNode(
                              item.textContent.substring(0, startOffset)
                          )
                        : document.createElement("span");
                lastNode =
                    startOffset === item.textContent.length
                        ? null
                        : document.createElement("span");

                if (lastNode !== null) {
                    inNodeArr.push(lastNode);
                    lastNode.innerText =
                        item.textContent.substring(startOffset);

                    if (item.nodeType !== Node.TEXT_NODE) {
                        lastNode.style.cssText = item.style.cssText;
                    }
                }

                if (firstNode !== null) {
                    firstNode = item;
                    firstNode.textContent = item.textContent.substring(
                        0,
                        startOffset
                    );
                }

                if (firstNode) newDiv.appendChild(firstNode);
                if (lastNode) newDiv.appendChild(lastNode);

                last = lastNode;
            }
            // 마지막 줄 처리 (현재 노드가 endContainer 이거나 endContainer.parentElement 일 때)
            else if (_isSameNode(item, range.endContainer)) {
                console.log("end");
                isEnd = true;
                isIn = false;

                let firstNode, lastNode;
                lastNode =
                    endOffset === item.textContent.length
                        ? null
                        : item.nodeType === Node.TEXT_NODE
                        ? document.createTextNode(
                              item.textContent.substring(endOffset)
                          )
                        : document.createElement("span");
                firstNode = document.createElement("span");

                if (item.nodeType !== Node.TEXT_NODE) {
                    firstNode.style.cssText = item.style.cssText;
                }
                inNodeArr.push(firstNode);
                firstNode.innerText = item.textContent.substring(0, endOffset);

                if (lastNode !== null) {
                    lastNode = item;
                    lastNode.textContent =
                        item.textContent.substring(endOffset);
                }

                if (firstNode) newDiv.appendChild(firstNode);
                if (lastNode) newDiv.appendChild(lastNode);

                last = firstNode;
            }
            // 중간 줄 처리
            else if (isIn) {
                console.log("in");
                if (item.nodeType === Node.TEXT_NODE) {
                    const span = document.createElement("span");
                    inNodeArr.push(span);
                    span.innerText = item.textContent;

                    newDiv.appendChild(span);
                } else {
                    inNodeArr.push(item);
                    newDiv.appendChild(item);
                }
            } else {
                console.log("out");
                newDiv.appendChild(item);
            }
        }

        // endOffset 이 0 일 때 처리
        if (
            endOffset === 0 &&
            (nextDiv === range.endContainer ||
                nextDiv.parentElement === range.endContainer)
        ) {
            console.log("endOffset === 0");
            last = newDiv;
            isEnd = true;
            isIn = false;
        }

        // 줄 단위로 교체
        RootDIV.parentElement.replaceChild(newDiv, RootDIV);
    }

    // 스타일 적용|해제
    _setStyleProperty(inNodeArr, styleName, style);
    // 커서를 드래그한 마지막 위치에 놓도록 수정
    _endToCursor(selection, new Range(), last);
}
