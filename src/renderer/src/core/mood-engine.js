export const getMoodColor = (mood) => {
    const mapping = {
        happy: 'luna-mood-happy',
        playful: 'luna-mood-playful',
        thoughtful: 'luna-mood-thoughtful',
        curious: 'luna-mood-curious',
        neutral: 'luna-mood-neutral'
    };
    return mapping[mood] || mapping.neutral;
};
