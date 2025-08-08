import GaltonBoard from '@/components/GaltonBoard'

const Index = () => {
  return (
    <>
      {/* Background layer - 1.2x size with proper centering */}
      <div 
        className="synthwave-bg" 
        style={{ 
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120vw',
          height: '120vh',
          zIndex: -1
        }} 
      />
      
      {/* Content layer - can have constraints */}
      <div className="relative min-h-screen">
        <GaltonBoard />
      </div>
    </>
  )
}

export default Index
