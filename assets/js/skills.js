/**
 * Skills Page JavaScript
 * Handles "By Domain" vs "By Level" tab switching using View Toggling
 */

document.addEventListener('DOMContentLoaded', () => {
    const tabDomain = document.getElementById('tab-domain');
    const tabLevel = document.getElementById('tab-level');
    const domainView = document.getElementById('domain-view');
    const levelView = document.getElementById('level-view');

    // Safety check: ensure we are on the skills page with correct structure
    if (!tabDomain || !tabLevel || !domainView || !levelView) return;

    let isLevelViewPopulated = false;

    // Helper to extract data from DOM Content
    function getSkillData() {
        const skills = [];
        // Only query from domainView to ensure we get the source of truth
        const skillCards = domainView.querySelectorAll('.grid > div');

        skillCards.forEach(card => {
            // Robustly find the info inside
            const nameEl = card.querySelector('.flex-col span:first-child');
            // Use specific classes to identify the level tag reliably
            const levelEl = card.querySelector('.uppercase.tracking-wider');

            if (nameEl && levelEl) {
                // Determine the group key
                let rawLevel = levelEl.textContent.trim();
                let groupKey = 'Learning'; // Default

                if (rawLevel.toLowerCase().includes('production')) groupKey = 'Production';
                else if (rawLevel.toLowerCase().includes('academic')) groupKey = 'Academic';
                else if (rawLevel.toLowerCase().includes('learning')) groupKey = 'Learning';

                skills.push({
                    html: card.innerHTML, // Store inner HTML to re-wrap in new div
                    level: groupKey,
                    name: nameEl.textContent.trim()
                });
            }
        });
        return skills;
    }

    function populateLevelView() {
        if (isLevelViewPopulated) return;

        const allSkills = getSkillData();

        if (allSkills.length === 0) {
            levelView.innerHTML = '<p class="text-center text-slate-500">No skills data found.</p>';
            return;
        }

        // Group skills
        const groups = {
            'Production': [],
            'Academic': [],
            'Learning': []
        };

        allSkills.forEach(skill => {
            groups[skill.level].push(skill.html);
        });

        // Generate HTML
        let html = '';

        for (const [level, skillsContents] of Object.entries(groups)) {
            if (skillsContents.length > 0) {
                // Defines colors for headers
                let colorClass = 'text-primary';
                if (level === 'Academic') colorClass = 'text-purple-500';
                if (level === 'Learning') colorClass = 'text-slate-500';

                // Icon mapping
                let iconName = 'verified';
                if (level === 'Academic') iconName = 'school';
                if (level === 'Learning') iconName = 'auto_stories';

                // Reconstruct cards with proximity-card class
                const cardsHtml = skillsContents.map(innerContent => `
                    <div class="proximity-card flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-dark border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow">
                        ${innerContent}
                    </div>
                `).join('');

                html += `
                <div class="flex flex-col gap-3">
                    <div class="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-800/50">
                         <span class="material-symbols-outlined ${colorClass}">
                            ${iconName}
                         </span>
                         <h3 class="text-slate-900 dark:text-white text-lg font-bold">${level} Experience</h3>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        ${cardsHtml}
                    </div>
                </div>`;
            }
        }

        levelView.innerHTML = html;
        isLevelViewPopulated = true;
    }

    function showDomain() {
        // Visual updates for Tabs
        tabDomain.classList.add('border-primary', 'text-primary');
        tabDomain.classList.remove('border-transparent', 'text-slate-500', 'dark:text-[#92adc9]');

        tabLevel.classList.remove('border-primary', 'text-primary');
        tabLevel.classList.add('border-transparent', 'text-slate-500', 'dark:text-[#92adc9]');

        // Toggle Views
        domainView.classList.remove('hidden');
        levelView.classList.add('hidden');
    }

    function showLevel() {
        // Populate if first time
        populateLevelView();

        // Visual updates for Tabs
        tabLevel.classList.add('border-primary', 'text-primary');
        tabLevel.classList.remove('border-transparent', 'text-slate-500', 'dark:text-[#92adc9]');

        tabDomain.classList.remove('border-primary', 'text-primary');
        tabDomain.classList.add('border-transparent', 'text-slate-500', 'dark:text-[#92adc9]');

        // Toggle Views
        domainView.classList.add('hidden');
        levelView.classList.remove('hidden');
    }

    // Event Listeners
    tabDomain.addEventListener('click', showDomain);
    tabLevel.addEventListener('click', showLevel);
});
