import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import axios from 'axios';
import { useChartColors } from '../context/ChartColorContext';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function UpdateSkillsButton() {
    const { globalSpecs, activeThemeId } = useEditor();
    const { chartColors } = useChartColors();
    const { getAuthHeaders } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleUpdateSkills = async () => {
        setLoading(true);
        try {
            const headers = await getAuthHeaders();
            const response = await axios.post('/api/export-skills',
                { specs: globalSpecs, chartColors },
                { responseType: 'blob', headers }
            );

            // Create a download link and trigger it
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'generated_skills.zip');
            document.body.appendChild(link);
            link.click();
            link.remove();

            alert("Skills package (.zip) generated and downloaded!");
        } catch (error) {
            console.error("Failed to export skills", error);
            alert("Failed to export skills: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleUpdateSkills}
            disabled={loading}
            variant="primary"
            className="flex items-center gap-2 whitespace-nowrap text-sm"
            style={{ height: '36px', padding: '0 16px' }}
        >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Download Skills
        </Button>
    );
}
