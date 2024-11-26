const app = {
    patternName: '',
    tickRate: 250,
    stages: [],
    currentStage: 0,
    currentFrame: 0,
    colors: ['off', '#FF0000', '#0000FF', '#FFA500', '#FFFFFF', '#00FF00', '#800080'],
    selectedColor: 'off',
    lightCount: 22,
    previewInterval: null,
    lightbars: {
        integrity44: {
            name: "Integrity 44\"",
            lightOrder: [16, 15, 14, 13, 12, 1, 2, 3, 4, 5, 17, 6, 18, 19, 20, 21, 22, 11, 10, 9, 8, 7],
            layout: [
                { type: 'front', lights: [16, 15, 14, 13, 12, 1, 2, 3, 4, 5] },
                { type: 'side', lights: [17, 6] },
                { type: 'back', lights: [18, 19, 20, 21, 22, 11, 10, 9, 8, 7] }
            ],
            lightStyles: {
                default: { width: '7.0vw', height: '3.5vw', borderRadius: '1.0vw' },
                // side: { width: '30px', height: '30px', transform: 'rotate(45deg)' }
                side: { width: '7.0vw', height: '3.5vw', borderRadius: '1.0vw' }
            }
        },
        integrity51: {
            name: "Integrity 51\"",
            lightOrder: [16, 15, 25, 14, 13, 12, 1, 2, 3, 23, 4, 5, 17, 6, 26, 18, 19, 20, 21, 22, 11, 10, 9, 8, 7, 24],
            layout: [
                { type: 'front', lights: [16, 15, 25, 14, 13, 12, 1, 2, 3, 23, 4, 5] },
                { type: 'side', lights: [17, 6] },
                { type: 'back', lights: [26, 18, 19, 20, 21, 22, 11, 10, 9, 8, 7, 24] }
            ],
            lightStyles: {
                default: { width: '6.0vw', height: '3.0vw', borderRadius: '0.8vw' },
                side: { width: '6.0vw', height: '3.0vw', borderRadius: '0.8vw' }
            }
        },
        freedom: {
            name: "Freedom\"",
            lightOrder: [10, 9, 8, 1, 2, 3, 11, 4, 12, 13, 14, 7, 6, 5],
            layout: [
                { type: 'front', lights: [10, 9, 8, 1, 2, 3] },
                { type: 'side', lights: [11, 4] },
                { type: 'back', lights: [12, 13, 14, 7, 6, 5] }
            ],
            lightStyles: {
                default: { width: '8.0vw', height: '4.0vw', borderRadius: '1.2vw' },
                side: { width: '8.0vw', height: '4.0vw', borderRadius: '1.2vw' }
            }
        }
    },
    selectedLightbar: 'integrity44',

    init() {
        this.cacheDom();
        this.bindEvents();
        this.addStage();
        this.renderColorSelector();
        this.renderStagePreviewButtons();
    },

    cacheDom() {
        this.patternNameInput = document.getElementById('pattern-name');
        this.tickRateInput = document.getElementById('tick-rate');
        this.addStageBtn = document.getElementById('add-stage');
        this.savePatternBtn = document.getElementById('save-pattern');
        this.stagesContainer = document.getElementById('stages-container');
        this.previewContainer = document.getElementById('preview-container');
        this.playPreviewBtn = document.getElementById('play-preview');
        this.colorSelector = document.getElementById('color-selector');
        this.loadPatternBtn = document.getElementById('load-pattern');
        this.stagePreviewContainer = document.getElementById('stage-preview-container');
    },

    selectLightbar(lightbarId) {
        this.selectedLightbar = lightbarId;
        this.lightCount = this.lightbars[lightbarId].lightOrder.length;
        this.stages.forEach(stage => {
            stage.frames = stage.frames.map(frame => {
                return this.createEmptyFrame().map((color, index) => frame[index] || color);
            });
        });
        this.renderStages();
    },

    bindEvents() {
        this.addStageBtn.addEventListener('click', () => this.addStage());
        this.savePatternBtn.addEventListener('click', () => this.savePattern());
        this.patternNameInput.addEventListener('input', (e) => this.patternName = e.target.value);
        this.tickRateInput.addEventListener('input', (e) => this.tickRate = parseInt(e.target.value));
        this.playPreviewBtn.addEventListener('click', () => this.togglePreview());
        document.getElementById('lightbar-selector').addEventListener('change', (e) => this.selectLightbar(e.target.value));
        this.loadPatternBtn.addEventListener('click', () => this.loadPattern());
    },

    addStage() {
        const stage = {
            frames: [this.createEmptyFrame()]
        };
        this.stages.push(stage);
        this.renderStages();
    },

    createEmptyFrame() {
        return Array(this.lightCount).fill('off');
    },

    renderStages() {
        this.stagesContainer.innerHTML = '';
        this.stages.forEach((stage, stageIndex) => {
            const stageEl = document.createElement('div');
            stageEl.className = 'stage';
            stageEl.innerHTML = `
                <h3>Stage ${stageIndex + 1}</h3>
                <div class="stage-controls">
                    <button class="add-frame">Add Frame</button>
                    <button class="remove-stage">Remove Stage</button>
                </div>
            `;

            const framesContainer = document.createElement('div');
            framesContainer.className = 'frames-container';
            framesContainer.addEventListener('dragover', this.onDragOver);
            framesContainer.addEventListener('drop', (e) => this.onDropBetweenFrames(e, stageIndex));

            stage.frames.forEach((frame, frameIndex) => {
                const frameEl = this.createFrameElement(frame, stageIndex, frameIndex);
                framesContainer.appendChild(frameEl);
            });

            stageEl.appendChild(framesContainer);
            this.stagesContainer.appendChild(stageEl);

            stageEl.querySelector('.add-frame').addEventListener('click', () => this.addFrame(stageIndex));
            stageEl.querySelector('.remove-stage').addEventListener('click', () => this.removeStage(stageIndex));
        });

        // Update pattern name and tick rate inputs
        document.getElementById('pattern-name').value = this.patternName;
        document.getElementById('tick-rate').value = this.tickRate;
        this.renderStagePreviewButtons();
    },

    createFrameElement(frame, stageIndex, frameIndex) {
        const frameEl = document.createElement('div');
        frameEl.className = 'frame';
        frameEl.draggable = true;
        frameEl.innerHTML = `
        <span class="frame-number">Frame ${frameIndex + 1}</span>
        <div class="frame-controls">
            <button class="duplicate-frame">Duplicate</button>
            <button class="remove-frame">Remove</button>
        </div>
        `;

        const lightsContainer = document.createElement('div');
        lightsContainer.className = 'lights-container';

        const lightbar = this.lightbars[this.selectedLightbar];
        lightbar.layout.forEach(section => {
            const sectionEl = document.createElement('div');
            sectionEl.className = `light-row ${section.type}-lights`;

            section.lights.forEach(position => {
                const index = lightbar.lightOrder.indexOf(position);
                const light = document.createElement('div');
                light.className = `light light-${position}`;
                light.style.backgroundColor = frame[index] === 'off' ? '#000' : frame[index];
                light.dataset.position = position;

                // Apply light styles
                const style = section.type === 'side' ? lightbar.lightStyles.side : lightbar.lightStyles.default;
                Object.assign(light.style, style);

                light.addEventListener('click', () => this.setLightColor(stageIndex, frameIndex, index));
                sectionEl.appendChild(light);
            });

            lightsContainer.appendChild(sectionEl);
        });

        frameEl.appendChild(lightsContainer);
        frameEl.querySelector('.remove-frame').addEventListener('click', () => this.removeFrame(stageIndex, frameIndex));
        frameEl.querySelector('.duplicate-frame').addEventListener('click', () => this.duplicateFrame(stageIndex, frameIndex));
        frameEl.addEventListener('dragstart', (e) => this.onDragStart(e, stageIndex, frameIndex));
        frameEl.addEventListener('dragenter', this.onDragEnter);
        frameEl.addEventListener('dragleave', this.onDragLeave);
        frameEl.addEventListener('dragover', this.onDragOver);
        frameEl.addEventListener('drop', (e) => this.onDrop(e, stageIndex, frameIndex));
        return frameEl;
    },

    setLightColor(stageIndex, frameIndex, lightIndex) {
        const currentColor = this.stages[stageIndex].frames[frameIndex][lightIndex];
        const newColor = this.selectedColor === 'off' ? 'off' : this.selectedColor;

        // If the clicked light already has the selected color, turn it off
        if (currentColor === newColor) {
            this.stages[stageIndex].frames[frameIndex][lightIndex] = 'off';
        } else {
            // Otherwise, set it to the selected color
            this.stages[stageIndex].frames[frameIndex][lightIndex] = newColor;
        }

        this.renderStages();
    },
    addFrame(stageIndex) {
        this.stages[stageIndex].frames.push(this.createEmptyFrame());
        this.renderStages();
    },

    removeFrame(stageIndex, frameIndex) {
        if (this.stages[stageIndex].frames.length > 1) {
            this.stages[stageIndex].frames.splice(frameIndex, 1);
            this.renderStages();
        }
    },

    removeStage(stageIndex) {
        if (this.stages.length > 1) {
            this.stages.splice(stageIndex, 1);
            this.renderStages();
        }
    },

    renderColorSelector() {
        const colorNames = ['off', 'red', 'blue', 'amber', 'white', 'green', 'purple'];
        this.colors.forEach((color, index) => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color === 'off' ? '#000' : color;
            colorOption.title = colorNames[index];
            colorOption.addEventListener('click', () => this.selectColor(color));
            this.colorSelector.appendChild(colorOption);
        });
    },

    selectColor(color) {
        this.selectedColor = color;
        document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
        document.querySelector(`.color-option[style*="${color}"]`).classList.add('selected');
    },

    savePattern() {
        const lightbar = this.lightbars[this.selectedLightbar];
        const pattern = {
            name: this.patternName,
            tickRate: this.tickRate,
            stages: this.stages.map(stage => ({
                frames: stage.frames.map(frame => {
                    const mappedFrame = {};
                    lightbar.lightOrder.forEach((lightNumber, index) => {
                        mappedFrame[lightNumber] = this.getColorName(frame[index]);
                    });
                    return mappedFrame;
                })
            })),
            lightbar: this.selectedLightbar
        };

        const luaTable = this.convertToLuaTable(pattern);
        const luaCode = `return ${luaTable}`;

        navigator.clipboard.writeText(luaCode).then(() => {
            alert('Pattern saved to clipboard as Lua table with return statement!');
        }).catch(err => {
            console.error('Failed to copy pattern to clipboard:', err);
            alert('Failed to save pattern to clipboard. Check the console for details.');
        });
    },

    convertToLuaTable(obj, indent = 0) {
        const indentStr = '    '.repeat(indent);
        let result = '{\n';

        if (Array.isArray(obj)) {
            obj.forEach((value, index) => {
                result += `${indentStr}    [${index + 1}] = `;
                if (typeof value === 'object' && value !== null) {
                    result += this.convertToLuaTable(value, indent + 1);
                } else if (typeof value === 'string') {
                    result += `"${value}"`;
                } else {
                    result += value;
                }
                result += ',\n';
            });
        } else {
            for (const [key, value] of Object.entries(obj)) {
                const luaKey = isNaN(key) ? key : `[${key}]`;
                result += `${indentStr}    ${luaKey} = `;

                if (typeof value === 'object' && value !== null) {
                    result += this.convertToLuaTable(value, indent + 1);
                } else if (typeof value === 'string') {
                    result += `"${value}"`;
                } else {
                    result += value;
                }

                result += ',\n';
            }
        }

        result += `${indentStr}}`;
        return result;
    },

    getColorName(color) {
        const colorMap = {
            '#FF0000': 'red',
            '#0000FF': 'blue',
            '#FFA500': 'amber',
            '#FFFFFF': 'white',
            '#00FF00': 'green',
            '#800080': 'purple',
            'off': 'off'
        };
        return colorMap[color] || color;
    },

    togglePreview() {
        if (this.previewInterval) {
            clearInterval(this.previewInterval);
            this.previewInterval = null;
            this.playPreviewBtn.textContent = 'Play Full Preview';
        } else {
            this.playPreviewBtn.textContent = 'Stop Preview';
            this.previewPattern();
        }
    },

    previewPattern() {
        let stageIndex = 0;
        let frameIndex = 0;

        const updatePreview = () => {
            if (stageIndex >= this.stages.length) {
                stageIndex = 0;
            }

            const stage = this.stages[stageIndex];
            if (frameIndex >= stage.frames.length) {
                frameIndex = 0;
                stageIndex++;
                if (stageIndex >= this.stages.length) {
                    stageIndex = 0;
                }
            }

            const frame = stage.frames[frameIndex];
            this.renderPreviewFrame(frame);

            frameIndex++;
        };

        updatePreview();
        this.previewInterval = setInterval(updatePreview, this.tickRate);
    },

    renderPreviewFrame(frame) {
        this.previewContainer.innerHTML = '';
        const lightsContainer = document.createElement('div');
        lightsContainer.className = 'lights-container';

        const lightbar = this.lightbars[this.selectedLightbar];
        lightbar.layout.forEach(section => {
            const sectionEl = document.createElement('div');
            sectionEl.className = `light-row ${section.type}-lights`;

            section.lights.forEach(position => {
                const index = lightbar.lightOrder.indexOf(position);
                const light = document.createElement('div');
                light.className = `light light-${position}`;
                light.style.backgroundColor = frame[index] === 'off' ? '#000' : frame[index];
                light.dataset.position = position;

                // Apply light styles
                const style = section.type === 'side' ? lightbar.lightStyles.side : lightbar.lightStyles.default;
                Object.assign(light.style, style);

                sectionEl.appendChild(light);
            });

            lightsContainer.appendChild(sectionEl);
        });

        this.previewContainer.appendChild(lightsContainer);
    },

    duplicateFrame(stageIndex, frameIndex) {
        const originalFrame = this.stages[stageIndex].frames[frameIndex];
        const duplicatedFrame = [...originalFrame];
        this.stages[stageIndex].frames.splice(frameIndex + 1, 0, duplicatedFrame);
        this.renderStages();
    },

    onDragStart(e, stageIndex, frameIndex) {
        e.dataTransfer.setData('text/plain', JSON.stringify({ stageIndex, frameIndex }));
        e.target.classList.add('dragging');
        // Set a custom property to store the original position
        this.dragOrigin = { stageIndex, frameIndex };
    },

    onDragEnter(e) {
        e.preventDefault();
        e.target.closest('.frame')?.classList.add('drag-over');
    },

    onDragLeave(e) {
        e.preventDefault();
        e.target.closest('.frame')?.classList.remove('drag-over');
    },

    onDragOver(e) {
        e.preventDefault();
    },

    onDrop(e, targetStageIndex, targetFrameIndex) {
        e.preventDefault();
        const { stageIndex, frameIndex } = JSON.parse(e.dataTransfer.getData('text/plain'));

        if (stageIndex === targetStageIndex && frameIndex === targetFrameIndex) {
            return; // No change if dropped on itself
        }

        // Remove the frame from its original position
        const [movedFrame] = this.stages[stageIndex].frames.splice(frameIndex, 1);

        // Adjust the target index if moving within the same stage and moving forward
        if (stageIndex === targetStageIndex && frameIndex < targetFrameIndex) {
            targetFrameIndex--;
        }

        // Insert the frame at its new position
        this.stages[targetStageIndex].frames.splice(targetFrameIndex, 0, movedFrame);

        document.querySelectorAll('.frame.dragging, .frame.drag-over').forEach(el => {
            el.classList.remove('dragging', 'drag-over');
        });

        this.renderStages();
    },

    onDropBetweenFrames(e, targetStageIndex) {
        e.preventDefault();
        const { stageIndex, frameIndex } = this.dragOrigin;
        const targetFrameIndex = this.getTargetFrameIndex(e.clientY, targetStageIndex);

        if (stageIndex === targetStageIndex && frameIndex === targetFrameIndex) {
            return; // No change if dropped on itself
        }

        // Remove the frame from its original position
        const [movedFrame] = this.stages[stageIndex].frames.splice(frameIndex, 1);

        // Adjust the target index if moving within the same stage and moving forward
        let adjustedTargetFrameIndex = targetFrameIndex;
        if (stageIndex === targetStageIndex && frameIndex < targetFrameIndex) {
            adjustedTargetFrameIndex--;
        }

        // Insert the frame at its new position
        this.stages[targetStageIndex].frames.splice(adjustedTargetFrameIndex, 0, movedFrame);

        document.querySelectorAll('.frame.dragging, .frame.drag-over').forEach(el => {
            el.classList.remove('dragging', 'drag-over');
        });

        this.renderStages();
    },

    getTargetFrameIndex(clientY, stageIndex) {
        const frameElements = this.stagesContainer.querySelectorAll(`.stage:nth-child(${stageIndex + 1}) .frame`);
        for (let i = 0; i < frameElements.length; i++) {
            const rect = frameElements[i].getBoundingClientRect();
            if (clientY < rect.top + rect.height / 2) {
                return i;
            }
        }
        return frameElements.length;
    },

    loadPattern() {
        const luaTable = prompt("Paste the Lua table pattern here:");
        if (luaTable) {
            try {
                const pattern = this.parseLuaTable(luaTable);
                this.patternName = pattern.name;
                this.tickRate = pattern.tickRate;
                this.stages = Object.values(pattern.stages).map(stage => ({
                    frames: Object.values(stage.frames).map(frame => {
                        return Object.entries(frame).reduce((acc, [key, value]) => {
                            acc[parseInt(key) - 1] = value;
                            return acc;
                        }, this.createEmptyFrame());
                    })
                }));
                this.renderStages();
                alert('Pattern loaded successfully!');
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to load pattern: ' + error.message);
            }
        }
    },

    parseLuaTable(luaTable) {
        // Remove 'return' keyword if present
        const cleanedLuaTable = luaTable.replace(/^return\s*/, '');

        // Parse the Lua table
        const pattern = new Function(`return ${cleanedLuaTable.replace(/=/g, ':')}`)();

        if (!pattern.name || !pattern.tickRate || !pattern.stages) {
            throw new Error('Invalid pattern format');
        }

        // Convert color names to hex codes
        const colorMap = {
            red: "#FF0000",
            blue: "#0000FF",
            amber: "#FFA500",
            white: "#FFFFFF",
            green: "#00FF00",
            purple: "#800080",
            off: "off"
        };

        // Ensure stages and frames are objects
        if (!pattern.stages || typeof pattern.stages !== 'object') {
            throw new Error('Invalid stages format');
        }

        for (const stage of Object.values(pattern.stages)) {
            if (!stage.frames || typeof stage.frames !== 'object') {
                throw new Error('Invalid frames format in stage');
            }
            for (const frame of Object.values(stage.frames)) {
                for (const [lightId, colorName] of Object.entries(frame)) {
                    frame[lightId] = colorMap[colorName] || colorName;
                }
            }
        }

        return pattern;
    },

    renderStagePreviewButtons() {
        this.stagePreviewContainer.innerHTML = '';
        this.stages.forEach((stage, index) => {
            const button = document.createElement('button');
            button.textContent = `Preview Stage ${index + 1}`;
            button.addEventListener('click', () => this.previewStage(index));
            this.stagePreviewContainer.appendChild(button);
        });
    },

    previewStage(stageIndex) {
        if (this.previewInterval) {
            clearInterval(this.previewInterval);
        }

        const stage = this.stages[stageIndex];
        let frameIndex = 0;

        const updatePreview = () => {
            if (frameIndex >= stage.frames.length) {
                frameIndex = 0;
            }

            const frame = stage.frames[frameIndex];
            this.renderPreviewFrame(frame);

            frameIndex++;
        };

        updatePreview();
        this.previewInterval = setInterval(updatePreview, this.tickRate);
    },
};

app.init();