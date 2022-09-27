const apis = {
  loginByStudioAuthCodeAndPassword: {
    method: 'POST',
    url: 'training_recipe_running_web/v2/loginByStudioAuthCodeAndPassword',
    group: 'ssyypt'
  },
  queryStudioDeviceTotalAndOnlineNumAndMemberTotal: {
    method: 'POST',
    url: 'training_recipe_running_web/v2/queryStudioDeviceTotalAndOnlineNumAndMemberTotal',
    group: 'ssyypt'
  },
  queryTrainRecipeRunning: {
    method: 'POST',
    url: 'training_recipe_running_web/v2/queryTrainRecipeRunning',
    group: 'ssyypt'
  },
  queryStudioDoctorRecipeTotalNumInDays: {
    method: 'POST',
	url: 'training_recipe_running_web/v2/queryStudioDoctorRecipeTotalNumInDays',
	group: 'ssyypt'
  },
  queryWorkoutGenderCorrelation: {
	method: 'POST',
	url: 'training_recipe_running_web/v2/queryWorkoutGenderCorrelation',
	group: 'ssyypt'
  },
  queryStudioTrainUserSexAgeRatio: {
	method: 'POST',
	url: 'training_recipe_running_web/v2/queryStudioTrainUserSexAgeRatio',
	group: 'ssyypt'
  },
  queryStudioWorkoutUseNumAndDurationInDays: {
    method: 'POST',
    url: 'training_recipe_running_web/v2/queryStudioWorkoutUseNumAndDurationInDays',
    group: 'ssyypt'
  },
  queryStartupRateUsagePeak: {
    method: 'POST',
    url: 'training_recipe_running_web/v2/queryStartupRateUsagePeak',
    group: 'ssyypt'
  }
}

export default apis
