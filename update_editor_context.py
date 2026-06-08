import re

with open('frontend/src/context/EditorContext.jsx', 'r') as f:
    content = f.read()

# Replace the fetchData inside useEffect to also fetch activeThemeId
new_fetch_data = """
    // Fetch initial specs and theme
    useEffect(() => {
        const fetchData = async () => {
            try {
                // First get the active theme ID
                const activeThemeRes = await axios.get('/api/active_theme_id');
                const initialActiveThemeId = activeThemeRes.data.activeThemeId || 'dak_default';
                setActiveThemeId(initialActiveThemeId);

                const [specsRes, themeRes] = await Promise.all([
                    axios.get(`/api/specs?theme_id=${initialActiveThemeId}`),
                    axios.get('/api/theme')
                ]);
                
                if (specsRes.data && Object.keys(specsRes.data).length > 0) {
                    setGlobalSpecs(specsRes.data);
                } else {
                    // Reset to defaults if no specs found for this theme
                    setGlobalSpecs({
                        ...initialSpecs,
                        typography: { ...initialSpecs.typography }
                    });
                }
                
                if (themeRes.data && themeRes.data.theme) {
                    setTheme(themeRes.data.theme);
                }
            } catch (err) {
                console.error("Failed to fetch initial data", err);
            } finally {
                setIsInitialLoad(false);
                hasInitialLoadedRef.current = true;
            }
        };
        fetchData();
    }, []); // Only run once on mount

    // Fetch specs when activeThemeId changes (after initial load)
    useEffect(() => {
        if (isInitialLoad || !hasInitialLoadedRef.current) return;
        
        const fetchSpecsForTheme = async () => {
            try {
                const specsRes = await axios.get(`/api/specs?theme_id=${activeThemeId}`);
                if (specsRes.data && Object.keys(specsRes.data).length > 0) {
                    setGlobalSpecs(specsRes.data);
                }
            } catch (err) {
                console.error("Failed to fetch specs for new theme", err);
            }
        };
        
        fetchSpecsForTheme();
        
        // Also save the active theme ID to backend
        axios.post('/api/active_theme_id', { activeThemeId }).catch(e => console.error("Failed to save active theme ID", e));
        
    }, [activeThemeId, isInitialLoad]);
"""

# Find the start and end of the original useEffect block
start_idx = content.find('    // Fetch initial specs and theme')
end_idx = content.find('    // Save to API when theme changes')

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_fetch_data + '\n' + content[end_idx:]
    with open('frontend/src/context/EditorContext.jsx', 'w') as f:
        f.write(content)
else:
    print("Could not find useEffect blocks to replace")
