export default function InitialDisplay(){
    return (
        <div 
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw", 
                textAlign: "center"
            }}
        >
            <p 
                style={{ 
                    fontSize: "20px", 
                    fontWeight: "bold" 
                }}
            >
                Text Test!
            </p>
            <button 
                style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                Button Test
            </button>
        </div>
    );
}