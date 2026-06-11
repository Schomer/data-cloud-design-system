import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { useChartColors } from '../context/ChartColorContext';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import * as fs from '../services/firestoreService';

export default function UpdateSkillsButton() {
    const { globalSpecs, activeThemeId } = useEditor();
    const { chartColors } = useChartColors();
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleUpdateSkills = async () => {
        setLoading(true);
        try {
            // Get all skills from Firestore
            const skills = await fs.getAllSkills();
            
            if (skills.length === 0) {
                alert("No skills found in Firestore. Please seed your data first.");
                return;
            }

            // Build a zip file client-side using JSZip
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();

            for (const skill of skills) {
                if (skill.path && skill.content) {
                    zip.file(`generated_skills/${skill.path}`, skill.content);
                }
            }

            const blob = await zip.generateAsync({ type: 'blob' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `generated_skills_${activeThemeId}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

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
