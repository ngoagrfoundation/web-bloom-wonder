<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$data = getJsonBody();
$formType = $data['form_type'] ?? 'unknown';
$formData = $data['data'] ?? $data;

if (isset($formData['form_type'])) {
    unset($formData['form_type']);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '';

try {
    $pdo = getDB();

    switch ($formType) {
        case 'contact':
            $stmt = $pdo->prepare("INSERT INTO contact_submissions (name, email, phone, message, ip_address) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $formData['name'] ?? '',
                $formData['email'] ?? '',
                $formData['phone'] ?? '',
                $formData['message'] ?? '',
                $ip
            ]);
            break;

        case 'volunteer':
            $stmt = $pdo->prepare("INSERT INTO volunteer_submissions (full_name, email, phone, location, initiatives, availability, experience, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $formData['name'] ?? $formData['full_name'] ?? '',
                $formData['email'] ?? '',
                $formData['phone'] ?? '',
                $formData['location'] ?? '',
                is_array($formData['initiatives'] ?? '') ? implode(', ', $formData['initiatives']) : ($formData['initiatives'] ?? ''),
                is_array($formData['availability'] ?? '') ? implode(', ', $formData['availability']) : ($formData['availability'] ?? ''),
                $formData['experience'] ?? '',
                $ip
            ]);
            break;

        case 'partner':
            $stmt = $pdo->prepare("INSERT INTO partner_submissions (organization_name, contact_person, email, phone, organization_type, partnership_interest, message, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $formData['organizationName'] ?? $formData['organization_name'] ?? '',
                $formData['contactPerson'] ?? $formData['contact_person'] ?? '',
                $formData['email'] ?? '',
                $formData['phone'] ?? '',
                $formData['organizationType'] ?? $formData['organization_type'] ?? '',
                is_array($formData['partnershipInterest'] ?? '') ? implode(', ', $formData['partnershipInterest']) : ($formData['partnershipInterest'] ?? $formData['partnership_interest'] ?? ''),
                $formData['message'] ?? '',
                $ip
            ]);
            break;

        case 'adopt_student':
            $stmt = $pdo->prepare("INSERT INTO adopt_student_submissions (sponsor_name, email, phone, city, grade_level, duration, message, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $formData['sponsorName'] ?? $formData['sponsor_name'] ?? $formData['name'] ?? '',
                $formData['email'] ?? '',
                $formData['phone'] ?? '',
                $formData['city'] ?? '',
                $formData['gradeLevel'] ?? $formData['grade_level'] ?? '',
                $formData['duration'] ?? '',
                $formData['message'] ?? '',
                $ip
            ]);
            break;

        case 'report_challenge':
            $stmt = $pdo->prepare("INSERT INTO report_challenge_submissions (name, phone, email, location, challenge_type, description, people_affected, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $formData['name'] ?? '',
                $formData['phone'] ?? '',
                $formData['email'] ?? '',
                $formData['location'] ?? '',
                $formData['challengeType'] ?? $formData['challenge_type'] ?? '',
                $formData['description'] ?? '',
                $formData['peopleAffected'] ?? $formData['people_affected'] ?? '',
                $ip
            ]);
            break;

        case 'sanskrit_registration':
            $stmt = $pdo->prepare("INSERT INTO sanskrit_registrations (name, mobile, address, age, batch, ip_address) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $formData['name'] ?? '',
                $formData['mobile'] ?? '',
                $formData['address'] ?? '',
                $formData['age'] ?? '',
                $formData['batch'] ?? '',
                $ip
            ]);
            break;

        case 'dental_registration':
            $stmt = $pdo->prepare("INSERT INTO dental_registrations (name, mobile, address, problem, ip_address) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $formData['name'] ?? '',
                $formData['mobile'] ?? '',
                $formData['address'] ?? '',
                $formData['problem'] ?? '',
                $ip
            ]);
            break;

        case 'event_registration':
            $stmt = $pdo->prepare("INSERT INTO event_registrations (event_title, event_category, full_name, email, phone, participants, special_requirements, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $formData['event_title'] ?? '',
                $formData['event_category'] ?? '',
                $formData['full_name'] ?? '',
                $formData['email'] ?? '',
                $formData['phone'] ?? '',
                intval($formData['participants'] ?? 1),
                $formData['special_requirements'] ?? '',
                $ip
            ]);
            break;

        default:
            // Fallback: save to form_submissions if table exists
            $stmt = $pdo->prepare("INSERT INTO form_submissions (form_type, data, ip_address) VALUES (?, ?, ?)");
            $stmt->execute([$formType, json_encode($formData), $ip]);
            break;
    }

    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save submission', 'debug' => $e->getMessage()]);
}
