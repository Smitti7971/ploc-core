const prisma = require('../config/database');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await prisma.userFitnessProfile.findUnique({
      where: { userId }
    });
    
    if (!profile) {
      return res.status(200).json({ success: true, profile: null });
    }
    
    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching fitness profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { biometrics, goals, preferences, limitations, hasCompletedOnboarding } = req.body;
    
    const data = {
      gender: biometrics?.gender,
      age: biometrics?.age,
      height: biometrics?.height,
      weight: biometrics?.weight,
      targetWeight: goals?.targetWeight,
      bodyFatPercentage: biometrics?.bodyFatPercentage,
      muscleMass: biometrics?.muscleMass,
      leanMass: biometrics?.leanMass,
      measurements: biometrics?.measurements || {},
      
      primaryObjective: goals?.primaryObjective,
      secondaryObjectives: goals?.secondaryObjectives || [],
      
      experienceLevel: preferences?.experienceLevel,
      desiredFrequency: preferences?.desiredWeeklyFrequency,
      availableTime: preferences?.availableTimeMinutes,
      trainingLocation: preferences?.trainingLocation,
      availableEquipment: preferences?.availableEquipment || [],
      
      injuries: limitations?.injuries || [],
      forbiddenExercises: limitations?.forbiddenExercises || [],
      medicalRestrictions: limitations?.medicalRestrictions || [],
    };

    // If we want to save age and hasCompletedOnboarding, we should update the User table
    // But for now, we just update UserFitnessProfile.

    const profile = await prisma.userFitnessProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data
      }
    });

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Error updating fitness profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
