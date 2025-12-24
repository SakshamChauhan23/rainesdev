async function testReviewSubmission() {
  // Test submitting a review before eligibility
  const response = await fetch('http://localhost:3000/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: '1a62f468-5aa7-48f6-b40e-b672c760ac77',
      agentId: 'cmjerxu2z0001k3p346ruvw75',
      rating: 5,
      comment: 'Test review - this should be blocked due to 14-day waiting period'
    })
  })

  const data = await response.json()
  console.log('Response status:', response.status)
  console.log('Response:', JSON.stringify(data, null, 2))
}

testReviewSubmission()
